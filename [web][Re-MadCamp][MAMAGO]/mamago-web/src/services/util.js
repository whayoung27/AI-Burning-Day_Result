import * as R from 'ramda';
import I18n from 'i18next';
// create_table "dialogs", force: :cascade do |t|
//   t.integer "source", default: 0, null: false
//   t.integer "target", default: 1, null: false
//   t.bigint "user_id"
//   t.boolean "complete", default: false, null: false
//   t.boolean "feedback", default: true, null: false
//   t.bigint "question_id", comment: "대화를 시작하는 질문"
//   t.text "original", comment: "원본 문장"
//   t.text "translated", comment: "번역 문장"
//   t.text "comprehanded", comment: "예상한 의도"
//   t.text "user_intention", comment: "실제 의도"
//   t.text "user_intention_translated", comment: "의도한 문장"
//   t.datetime "created_at", precision: 6, null: false
//   t.datetime "updated_at", precision: 6, null: false
//   t.index ["question_id"], name: "index_dialogs_on_question_id"
//   t.index ["user_id"], name: "index_dialogs_on_user_id"
// end
// const example = {
//   id: '123124125',
//   original: 'hello',
//   translated: 'hello',
//   comprehanded: '안녕',
//   user_intention: '안녕!',
//   user_intention_translated: 'hello!'
// };

export const buildChats = dialog => {
  const {
    question,
    original,
    translated,
    comprehanded,
    feedback,
    user_intention,
    user_intention_translated
  } = dialog;
  const chats = [];
  const chat = { type: '', message: '' };

  if (question) chats.push({ type: 'mamago', message: question });

  if (original) {
    chats.push({ type: 'user', message: original });
    if (comprehanded)
      chats.push({
        type: 'mamago',
        message: I18n.t('comp_prefix') + comprehanded + I18n.t('comp_postfix')
      });
    if (translated)
      chats.push({
        type: 'mamago',
        message: I18n.t('trans_prefix') + translated + I18n.t('trans_postfix')
      });
    if (comprehanded) chats.push({ type: 'mamago', message: '내가 생각한 게 맞아?' });
  }

  if (!R.isNil(feedback)) {
    if (!feedback) {
      chats.push({ type: 'user', message: '맞아' });
      chats.push({ type: 'mamago', message: '잘했어!' });
      return chats;
    } else {
      chats.push({ type: 'user', message: '아니야' });
      chats.push({ type: 'mamago', message: '그렇다면 네가 의도한 것을 말해줄래?' });
    }

    if (user_intention) {
      chats.push({ type: 'user', message: user_intention });
      if (user_intention_translated)
        chats.push({ type: 'mamago', message: user_intention_translated });
    }
  }
  return chats;
};

export const validateEmail = email => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  alert('You have entered an invalid email address!');
  return false;
};

export const validatePassword = (password = '') => {
  if (password.length >= 6) {
    return true;
  }
  alert('Please Enter more than 5 letters!');
  return false;
};
