class ApplicationController < ActionController::API
  def current_user
    @current_user ||= authenticate_token
  end

  def authenticate_token
    token = extract_token
    return nil unless token

    begin
      # Decodifica il token JWT usando la stessa chiave del backend
      secret = Rails.application.credentials.secret_key_base
      decoded = JWT.decode(token, secret, true, algorithm: 'HS256')
      user_id = decoded[0]['sub']
      User.find_by(id: user_id)
    rescue JWT::DecodeError, JWT::ExpiredSignature, JWT::InvalidIssuerError, StandardError => e
      Rails.logger.debug("JWT decode error: #{e.message}")
      nil
    end
  end

  def extract_token
    auth_header = request.headers['Authorization']
    return nil unless auth_header

    # Estrae il token da "Bearer <token>"
    parts = auth_header.split(' ')
    parts.last if parts.size == 2 && parts.first == 'Bearer'
  end

  # Gestione globale status code 401 (Unauthorized)
  def authenticate_user!
    unless current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  #Gestione globale status code 404
  rescue_from ActiveRecord::RecordNotFound do
    render json: { error: 'Risorsa non trovata' }, status: :not_found
  end
end

