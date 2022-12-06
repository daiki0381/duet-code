# frozen_string_literal: true

module Api
  module V1
    module CurrentUser
      class IdsController < ApplicationController
        before_action :authenticate_user

        def show
          render json: current_user.id, status: :ok
        end
      end
    end
  end
end
