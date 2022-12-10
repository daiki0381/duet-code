# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      def create
        FirebaseIdToken::Certificates.request
        raise ArgumentError, 'BadRequest Parameter' if payload.blank?

        @user = User.find_or_initialize_by(uid: payload['sub']) do |user|
          user.assign_attributes(sign_up_params)
        end
        if @user.save
          @user.update(github_access_token: sign_up_params[:github_access_token]) if @user.github_access_token != sign_up_params[:github_access_token]
          @user.update(name: sign_up_params[:name]) if @user.name != sign_up_params[:name]
          @user.update(avatar: sign_up_params[:avatar]) if @user.avatar != sign_up_params[:avatar]
          render json: { status_code: 201, status: 'created' }, status: :created
        else
          render json: { status_code: 422, status: 'unprocessable_entity' }, status: :unprocessable_entity
        end
      end

      def show
        @user = User.find(params[:id]).attributes
        @user.delete('github_access_token')
        @user.delete('uid')
        render json: @user, status: :ok
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
