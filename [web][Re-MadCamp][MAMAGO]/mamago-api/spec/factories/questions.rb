# frozen_string_literal: true

FactoryBot.define do
  factory :question do
    source { 0 }
    target { 1 }
    content { LiterateRandomizer.sentence }
  end
end
