class AuthController < ApplicationController
  before_action :authenticate_user!, only: [:me, :logout]

  # POST /auth/login
  def login
    user = User.find_by(email: params[:email])

    if user&.valid_password?(params[:password])
      token = Warden::JWTAuth::UserEncoder.new.call(
        user, :user, nil
      ).first

      response.set_header('Authorization', "Bearer #{token}")

      render json: {
        id: user.id,
        email: user.email
      }, status: :ok
    else
      render json: { error: 'Credenziali non valide' }, status: :unauthorized
    end
  end

  # POST /auth/register
  def register
    user = User.new(email: params[:user][:email], password: params[:user][:password])

    if user.save
      render json: {
        message: 'Utente registrato con successo',
        id: user.id,
        email: user.email
      }, status: :created
    else
      render json: { error: 'Errore durante la registrazione. Email già registrata', details: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /auth/logout
  def logout
    head :no_content
  end

  # GET /auth/me
  def me
    render json: {
      id: current_user.id,
      email: current_user.email
    }
  end
end
