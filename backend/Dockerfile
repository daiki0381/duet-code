FROM ruby:2.7

ENV LANG=C.UTF-8 \
  TZ=Asia/Tokyo

WORKDIR /app
RUN apt-get update -qq && apt-get install -y nodejs default-mysql-client
COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock
RUN bundle install

CMD ["rails", "server", "-b", "0.0.0.0"]
