module.exports = {
    // eslint 설정은 기본적으로 루트 디렉토리부터 검증대상 파일경로까지 캐스케이딩됨
    // {root: true} 를 설정하면 상위경로 설정을 물려받지 않음
    "root": true,

    // 빌트인 전역변수를 뭘 쓰느냐에 따라 다름
    // Map 과 같이 es6 에 추가된 전역변수를 쓴다면 es6: true
    // require("...") 와 같이 node 전역변수를 쓴다면 node: true
    // location.href 와 같이 브라우저 전역변수를 쓴다면 browser: true
    "env": {
        "es6": true,
        "browser": true,
        "node": true
    },

    // 문법에 따라 다름
    // es6 문법을 쓴다면 ecmaVersion: 6 (기본값은 5)
    // es6 모듈을 쓴다면 sourceType: "module" (기본값은 "script")
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": `module`
    },

    // npm 패키지로 퍼블리시된 eslint 설정을 갖다 쓸 수 있고
    // react, airbnb, google, standard 등이 유명함
    // 하지만 일단 eslint 추천안을 씁시다 정석 최고
    "extends": `eslint:recommended`,

    // 0 또는 "off" = 해당 규칙 비활성화 (검증하지 않음)
    // 1 또는 "warn" = 위반시 경고
    // 2 또는 "error" = 위반시 오류 (검증이 중단됨 = 빌드 실패)
    "rules": {
        // Possible Errors
        // for문 한 방향으로 고정
        "for-direction": 1,
        // getter는 return 필수
        "getter-return": 1,
        // async와 promise를 함께 쓰지마라, 그럴 필요도 없고
        "no-async-promise-executor": 1,
        // 반복문에 await을 사용하지마라, 성능 저하 큼, 마지막에 await Promise.all 처리 권장
        "no-await-in-loop": 1,
        // -0 사용하지마라
        "no-compare-neg-zero": 2,
        // 비교 연산자(==)를 할당 연산자(=)로 쓰지마라
        "no-cond-assign": 2,
        // console문은 디버깅 이후 제거할 것
        "no-console": [1, { allow: ["info", "warn", "error"] }],
        // 적절치 못한 조건문
        "no-constant-condition": 2,
        // 적절치 못한 정규표현식
        "no-control-regex": 1,
        // 패키징시는 디버거 제거
        "no-debugger": 1,
        // 중복되는 파라미터 불가
        "no-dupe-args": 2,
        // 중복되는 객체값 불가
        "no-dupe-keys": 1,
        // 중복되는 조건문 제거
        "no-duplicate-case": 1,
        // 빈줄 없애기
        "no-empty": 1,
        // 빈 클래스 없애기
        "no-empty-character-class": 1,
        // catch - error는 재할당 불가
        "no-ex-assign": 2,
        // 불필요한 이중부호 불가
        "no-extra-boolean-cast": 1,
        // 불필요한 괄호 불가
        "no-extra-parens": 1,
        // 불필요한 세미콜론 불가
        "no-extra-semi": 1,
        // 함수 재선언 불가
        "no-func-assign": 2,
        // 제한된 내장 함수 선언
        "no-inner-declarations": 1,
        // 잘못된 정규식 불가
        "no-invalid-regexp": 2,
        // 일관성 있는 띄어쓰기
        "no-irregular-whitespace": 1,
        // 글로벌 오브젝트만 부르기 불가
        "no-obj-calls": 2,
        // 객체의 직접적인 접근보다 object.prototype ... call 을 이용해 접근할 것
        "no-prototype-builtins": 1,
        // 명시적인 띄어쓰기 사용?
        "no-regex-spaces": 1,
        // 빈 배열을 허용치 않음
        "no-sparse-arrays": 1,
        // 템플릿 ${}을 이용시는 `를 이용
        "no-template-curly-in-string": 2,
        // 일관성 있는 표현 사용
        "no-unexpected-multiline": 1,
        // return 이후 코드 불가
        "no-unreachable": 2,
        // finally에서 직접적인 제어 불가
        "no-unsafe-finally": 2,
        // 왼쪽 비교연산자의 부정 금지
        "no-unsafe-negation": 1,
        // 좋지 않은 await 막기
        "require-atomic-updates": 1,
        "use-isnan": 1,
        "valid-typeof": 1,

        // Best Practices
        // getter와 setter는 함께 존재
        // "accessor-pairs": 1,
        // 배열 메소드의 적절한 리턴값 확인
        "array-callback-return": 1,
        // 변수 선언은 항상 위에서
        "block-scoped-var": 1,
        // 정적 메소드 아니면, this 사용, 정적 메소드면 static 사용
        // "class-methods-use-this": 1,
        // 조건문은 4개 미만까지 사용 가능
        "complexity": [0, 8],
        "consistent-return": 1,
        // 일관된 조건 블록 형성
        "curly": 1,
        // default-case, dot-location, dot-notation 사용 필요성 못느낌
        // !==, ===만 사용
        // "eqeqeq": 1,
        // for-in의 엄격한 사용
        "guard-for-in": 1,
        // 파일당 클래스 제한
        "max-classes-per-file": [1, 1],
        "no-alert": 1,
        // 보안상, 함수의 arguments를 이용한 코딩 금지
        "no-caller": 1,
        // case문에서 let, const는 괄호 사용
        "no-case-declarations": 1,
        // 정규식 특수문자 사용시 / 사용
        "no-div-regex": 1,
        // else 이후 if내 return 금지
        "no-else-return": 1,
        // 함수내 빈칸 금지 - 클래스 선언에서 빈칸일때 많음
        // "no-empty-function": 1,
        // 의미없는 빈 배열 금지
        "no-empty-pattern": 1,
        // ==, != 로 null 비교 금지
        "no-eq-null": 1,
        // eval() 보안상 사용 금지
        "no-eval": 1,
        // 원래 있던 객체 확장 금지
        "no-extend-native": 1,
        // this가 없으면 bind 에러처리
        "no-extra-bind": 1,
        // 루프 라벨링 필요할때만
        "no-extra-label": 1,
        // 스위치문 break같은 장치 없으면 별도 표시(// falls through)
        "no-fallthrough": 1,
        // 정확한 소수점 표기
        "no-floating-decimal": 1,
        // 전역 변수는 별도 설정하여 사용
        "no-global-assign": 1,
        // no-implicit-coercion 이거는 타입 변환의 유동성을 떨어뜨려 미사용
        // no-implicit-globals 그냥 선언하면 window의 붙는 것을 안다면 사용할 필요없다고 생각됨
        // 인라인 스크립트 제거
        "no-implied-eval": 1,
        // 생성자 함수는 대문자로 시작, 이 RULE은 숙지 필요
        "no-invalid-this": 1,
        // no-iterator 내용 모르겠음
        // no-labels 음 ??
        // 불필요한 블록 제거        
        "no-lone-blocks": 1,
        // 루프 안의 외부 변수 참조 금지(클로저)
        "no-loop-func": 1,
        // 의미없는 숫자 사용 금지
        // "no-magic-numbers": 1,
        // 의미없는 빈칸 금지
        "no-multi-spaces": 1,
        // \ 로 띄어쓰기 금지, 표준이 아닌데 관행으로 남음
        "no-multi-str": 1,
        // new를 사용한다면 담을 변수 필요
        "no-new": 1,
        // 잘 안쓰는 스타일, 좋지 않은 관행
        "no-new-func": 2,
        // 잘 알고있는 객체는 new 금지(String, Number, Boolean)
        "no-new-wrappers": 1,
        // 의미없는 숫자0 금지
        "no-octal": 1,
        // no-octal-escape 잘모르겠음
        // 파라미터 재할당 금지
        "no-param-reassign": 0,
        // getPrototypeOf 를 이용해 구하기
        // "getPrototypeOf": 1,
        // 변수 재선언 금지
        "no-redeclare": 1,
        // no-restricted-properties 잘모르겠음
        // return에서 연산 하지않기
        "no-return-assign": 1,
        // return에서 await 하지않기
        "no-return-await": 1,
        // 이상하게 자바스크립트 사용금지
        "no-script-url": 2,
        // 자기자신 할당 금지
        "no-self-assign": 2,
        // 자기자신 비교 금지
        "no-self-compare": 2,
        // 적절치 못한 콤마 사용 금지
        "no-sequences": 1,
        // 정상적인 에러 처리
        "no-throw-literal": 1,
        // 루프 탈출
        "no-unmodified-loop-condition": 1,
        "no-unused-expressions": [1, {"allowTernary": true}],
        "no-unused-labels": 1,
        "no-useless-call": 1,
        // "no-useless-catch": 1,
        "no-useless-concat": 1,
        "no-useless-escape": 1,
        "no-useless-return": 1,
        // no-void
        // no-warning-comments
        // no-with
        // prefer-named-capture-group
        "prefer-promise-reject-errors": 1,
        // 숫자 변환시, 10진수인지 표기
        "radix": 1,
        "require-await": 1,
        "vars-on-top": 1,
        "wrap-iife": 1,
        "yoda": 1,

        // Variables - 여기 나중에 다시 체크
        "no-delete-var": 2,
        "no-label-var": 1,
        "no-shadow": 1,        
        "no-unused-vars": [1, {
            "vars": `all`,
            "args": `after-used`,
            "argsIgnorePattern": `^__`
        }],

        // Node.js and CommonJS

        // Stylistic Issues
        "comma-dangle": [1, "always-multiline"],
        "eol-last": 1,
        "func-style": [1, `declaration`, { "allowArrowFunctions": true }],
        "indent": [1, "tab"],
        "max-len": [1, {
            "code": 160,
            "ignoreComments": true,
            "ignoreUrls": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true,
            "ignoreRegExpLiterals": true
        }],
        "no-unneeded-ternary": 1,
        //"quote-props": 1,
        "quotes": [1, "backtick"],
        "semi": [1, "never"],
        // "max-params": [1, 2],
        "max-lines-per-function": [1, {"max": 80,  "skipBlankLines": true, "skipComments": true}],

        // ECMAScript 6
        "arrow-body-style": 1,
        "arrow-parens": [1, `as-needed`],
        "arrow-spacing": 1,
        "no-useless-computed-key": 1,
        "no-useless-rename": 1,
        "no-var": 1,
        //"object-shorthand": 1,
        "prefer-arrow-callback": 1,
        "prefer-const": 1,
        //"prefer-destructuring": 1,
        "prefer-numeric-literals": 1,
        // No arguments (이후 다시 읽어볼 것)
        // "prefer-rest-params": 1,
        "prefer-spread": 1,
        "prefer-template": 1
    },
    // allow global variables
    "globals": {
        "chrome": true,
        "whale": true,
    }
};