# frozen_string_literal: true

class DialogService
  # Dialog 생성
  def self.create_dialog(target:, source:, user:)
    question = Question.all.sample
    dialog = Dialog.create!(user: user, target: target, source: source, question: question)
    dialog
  end

  # Dialog 업데이트
  def self.update_dialog(dialog, original: nil, feedback: nil, user_intention: nil, complete: nil)
    source = dialog.source # ko
    target = dialog.target # en -> 사용자의 입력 언어

    update_params =
      # 사용자의 입력을 받아 번역과 예상 의도를 업데이트
      if original.present?
        comprehended = DialogService.translate(source: source, target: target, text: original)
        translated = DialogService.translate(source: target, target: source, text: comprehended)
        { original: original, comprehended: comprehended, translated: translated }

      # 사용자의 피드백을 받아 저장
      elsif !feedback.nil?
        if ActiveModel::Type::Boolean.new.cast(feedback).in? [true, false]
          { feedback: ActiveModel::Type::Boolean.new.cast(feedback) }
        end
      # 사용자의 의도를 받아 최종 번역
      elsif user_intention.present?
        user_intention_translated = DialogService.translate(source: source, target: target, text: user_intention)
        { user_intention: user_intention, user_intention_translated: user_intention_translated }

      # 끝났는지 확인
      elsif complete.in? [true, false]
        { complete: complete }
      end

    return dialog unless update_params.present? # parmas 가 주어지지 않으면 업데이트 안함

    dialog.update!(update_params).then do |success|
      if success
        dialog
      else
        raise ApplicationError, 'updated failed'
      end
    end
  end

  private

  def self.translate(source:, target:, text:)
    res = SimpleRequest::Naver::Translate.new.call(
      source: source,
      target: target,
      text: text
    )

    res = JSON.parse(res.to_json, object_class: OpenStruct)
    res.data.message.result.translatedText
  end
end
