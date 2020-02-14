# frozen_string_literal: true

module SimpleRequest
  #
  # Naver
  #
  class Naver < Base
    HEADER = {
      X_NCP_APIGW_API_KEY_ID: 'ap0sn5nkeg',
      X_NCP_APIGW_API_KEY: 'PvH84StR0MC6bosGColAtVNaPWWCAiliqjnr3ndB'
    }.freeze

    def initialize; end

    def call(params, url: nil, headers:)
      res = execute(method: :post, url: url, params: params, headers: headers)

      {
        meta: { code: res.code },
        data: JSON.parse(res.body)
      }
    end
    #
    # translate ko -> eng, eng -> ko
    #
    class Translate < Naver
      def call(params)
        super(params,
          url: 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation',
          headers: HEADER.merge(content_type: :json)
        )
      end
    end

    #
    # tts for text to speech
    #
    class Tts < Naver
      def call(params)
        super(params,
          url: 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation',
          headers: HEADER.merge(content_type: :json)
        )
      end
    end

    private

    def execute(method:, url:, params:, headers:)
      RestClient::Request.execute(
        method: method,
        url: url, payload: params, headers: headers
      )
    end
  end
end
