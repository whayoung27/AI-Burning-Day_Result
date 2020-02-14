# frozen_string_literal: true

class CreateDialogs < ActiveRecord::Migration[6.0]
  def change
    create_table :dialogs do |t|
      t.integer :source, null: false, default: 0
      t.integer :target, null: false, default: 1
      t.references :user, null: true
      t.boolean :complete, null: false, default: false
      t.boolean :feedback, null: true
      t.references :question, comment: '대화를 시작하는 질문'
      t.text :original, comment: '원본 문장' # en
      t.text :translated, comment: '번역 문장' # ko
      t.text :comprehended, comment: '예상한 의도' # en
      t.text :user_intention, comment: '실제 의도' # ko
      t.text :user_intention_translated, comment: '의도한 문장' # en

      t.timestamps
    end
  end
end
