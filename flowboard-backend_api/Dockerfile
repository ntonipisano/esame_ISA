FROM ruby:3.4.6

WORKDIR /app

RUN apt-get update -qq && \
    apt-get install -y default-mysql-client && \
    rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock ./

RUN bundle install

COPY . .

EXPOSE 3000

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]