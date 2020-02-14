# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  before_create :generate_access_token

  validates :email, uniqueness: true, presence: true
  validates :email, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i }

  validates :password, presence: true, on: [:create]
  validates_length_of :password, minimum: 6, maximum: 15, allow_blank: false

  validates :access_token, uniqueness: true, null: false

  has_many :dialogs
  private

  def generate_access_token
    begin
      self.access_token = SecureRandom.urlsafe_base64
    end while User.where(access_token: access_token).exists?
  end
end
