# frozen_string_literal: true

module Api
  module V1
    class FeedbacksController < ApplicationController
      def create
        @review = Review.find(params[:review_id])
        if @review.update(feedback: params[:feedback])
          render status: :created
        else
          render status: :unprocessable_entity
        end
      end
    end
  end
end
