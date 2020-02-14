# frozen_string_literal: true

FactoryBot.define do
  factory :dialog do
    source { 0 }
    target { 1 }
    user { FactoryBot.create(:user) }
    question { FactoryBot.create(:question) }
    complete { false }
    feedback {}
    original {}
    translated {}
    comprehended {}
    user_intention {}
    user_intention_translated {}
  end
end
