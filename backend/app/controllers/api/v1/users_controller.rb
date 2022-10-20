# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      def create
        FirebaseIdToken::Certificates.request
        raise ArgumentError, 'BadRequest Parameter' if payload.blank?

        @user = User.find_or_initialize_by(uid: payload['sub'])
        @user.github_access_token = sign_up_params[:github_access_token]
        @user.name = sign_up_params[:name]
        @user.avatar = sign_up_params[:avatar]
        if @user.save
          render json: @user, status: :created
        else
          render json: @user.errors, status: :unprocessable_entity
        end
      end

      def show; end

      def delete; end

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
