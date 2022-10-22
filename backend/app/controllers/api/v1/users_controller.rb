# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user, only: %i[current_user_id]

      def create
        FirebaseIdToken::Certificates.request
        raise ArgumentError, 'BadRequest Parameter' if payload.blank?

        @user = User.find_or_initialize_by(uid: payload['sub']) do |user|
          user.assign_attributes(sign_up_params)
        end
        if @user.save
          render status: :created
        else
          render status: :unprocessable_entity
        end
      end

      def show
        @user = User.find(params[:id])
        render json: @user, status: :ok
      end

      def current_user_id
        render json: current_user.id, status: :ok
      end

      private

      def sign_up_params
        params.require(:user).permit(:github_access_token, :name, :avatar)
      end

      def token_from_request_headers
        request.headers['Authorization']&.split&.last
      end

      def token
        params[:token] || token_from_request_headers
      end

      def payload
        @payload ||= FirebaseIdToken::Signature.verify token
      end
    end
  end
end
