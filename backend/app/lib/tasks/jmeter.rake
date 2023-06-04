# frozen_string_literal: true

namespace :jmeter do
  desc 'load https://duet-code.fly.dev/api/v1/reviews'
  task load_reviews: :environment do
    test do
      threads count: 100, duration: 60 do
        visit name: '/api/v1/reviews', url: 'https://duet-code.fly.dev/api/v1/reviews'
      end
    end.jmx(file: 'jmeter.jmx')
  end

  desc 'load https://duet-code.fly.dev/api/v1/users/:user_id/wanted_reviews'
  task load_wanted_reviews: :environment do
    test do
      threads count: 100, duration: 60 do
        visit name: '/api/v1/users/:user_id/wanted_reviews', url: 'https://duet-code.fly.dev/api/v1/users/1/wanted_reviews'
      end
    end.jmx(file: 'jmeter.jmx')
  end

  desc 'load https://duet-code.fly.dev/api/v1/users/:user_id/accepted_reviews'
  task load_accepted_reviews: :environment do
    test do
      threads count: 100, duration: 60 do
        visit name: '/api/v1/users/:user_id/accepted_reviews', url: 'https://duet-code.fly.dev/api/v1/users/1/accepted_reviews'
      end
    end.jmx(file: 'jmeter.jmx')
  end

  desc 'create 50 wanted_reviews'
  task create_wanted_reviews: :environment do
    50.times do
      review = Review.create(
        reviewee_id: 1,
        reviewer_id: nil,
        title: 'Sample Title',
        pull_request_title: 'Sample Pull Request Title',
        pull_request_url: 'https://example.com',
        pull_request_description: 'Sample Pull Request Description',
        review_point: 'Sample Review Point',
        feedback: nil,
        thanks: nil,
        accepted_at: nil,
        created_at: DateTime.now,
        updated_at: DateTime.now
      )
      language = Language.create(
        name: 'Ruby',
        created_at: DateTime.now,
        updated_at: DateTime.now
      )
      ReviewLanguage.create(review_id: review.id, language_id: language.id)
    end
  end

  desc 'create 50 accepted_reviews'
  task create_accepted_reviews: :environment do
    50.times do
      review = Review.create(
        reviewee_id: 1,
        reviewer_id: 2,
        title: 'Sample Title',
        pull_request_title: 'Sample Pull Request Title',
        pull_request_url: 'https://example.com',
        pull_request_description: 'Sample Pull Request Description',
        review_point: 'Sample Review Point',
        feedback: nil,
        thanks: nil,
        accepted_at: DateTime.now,
        created_at: DateTime.now,
        updated_at: DateTime.now
      )
      language = Language.create(
        name: 'Ruby',
        created_at: DateTime.now,
        updated_at: DateTime.now
      )
      ReviewLanguage.create(review_id: review.id, language_id: language.id)
    end
  end

  desc 'delete reviews'
  task delete_reviews: :environment do
    Review.where(title: 'Sample Title').destroy_all
  end
end
