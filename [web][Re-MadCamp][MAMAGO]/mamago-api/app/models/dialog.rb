# frozen_string_literal: true

class Dialog < ApplicationRecord
  belongs_to :user
  belongs_to :question

  enum source: {
    ko: 0,
    en: 1
  }, _prefix: :src

  enum target: {
    ko: 0,
    en: 1
  }, _prefix: :tar
end
