# frozen_string_literal: true

module Api
  module V1
    class ThanksController < ApplicationController
      def create
        @review = Review.find(params[:review_id])
        if @review.update(thanks: params[:thanks])
          render status: :created
        else
          render status: :unprocessable_entity
        end
      end
    end
  end
end
