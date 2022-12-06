# frozen_string_literal: true

require 'date'

module Api
  module V1
    class AcceptedsController < ApplicationController
      before_action :authenticate_user

      def create
        @review = Review.find(params[:review_id])
        if @review.update(accepted_at: DateTime.now, reviewer_id: current_user.id)
          render status: :created
        else
          render status: :unprocessable_entity
        end
      end
    end
  end
end
