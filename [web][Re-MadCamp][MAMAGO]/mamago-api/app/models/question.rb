# frozen_string_literal: true

class Question < ApplicationRecord
  has_many :dialogs

  enum source: {
    ko: 0,
    en: 1
  }, _prefix: :src

  enum target: {
    tar_ko: 0,
    tar_en: 1
  }, _prefix: :tar
end
