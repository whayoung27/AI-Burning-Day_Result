# frozen_string_literal: true

class CreateQuestions < ActiveRecord::Migration[6.0]
  def change
    create_table :questions do |t|
      t.integer :source, null: false, default: 0
      t.integer :target, null: true
      t.text :content, null: false, default: '', comment: '질문의 내용'

      t.timestamps
    end
  end
end
