FROM ruby:2.7.6

ENV LANG=C.UTF-8 \
  TZ=Asia/Tokyo

WORKDIR /app
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client
COPY /app/Gemfile /app/Gemfile
COPY /app/Gemfile.lock /app/Gemfile.lock
RUN bundle install

CMD ["rails", "server", "-b", "0.0.0.0"]
