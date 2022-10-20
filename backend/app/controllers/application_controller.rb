# frozen_string_literal: true

class ApplicationController < ActionController::API
  include Firebase::Auth::Authenticable
end
