# frozen_string_literal: true

module Api
  module V1
    class ThanksController < ApplicationController
      def create
        @review = Review.find(params[:review_id])
        if @review.update(thanks: params[:thanks])
          render json: { status_code: 201, status: 'created' }, status: :created
        else
          render json: { status_code: 422, status: 'unprocessable_entity' }, status: :unprocessable_entity
        end
      end
    end
  end
end
