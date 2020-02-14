from django.shortcuts import render
from django.http import JsonResponse
from django.template import RequestContext
from record import naver_api_utils as naive
from record import slide_generator as slidegen
import configparser

import os
config = configparser.ConfigParser()
config.read('record/config.ini')


def index(request, current_template="title_template"):
    template_filenames = [
        "title_template",
        "paragraph_template",
        "image_template",
        "list_template",
    ]
    template_buttons = {
        "title_template": [
            "Title"
        ],
        "paragraph_template":[
            "Title",
            "Content"
        ],
        "image_template":[
            "Title",
            "Content"
        ],
        "list_template":[
            "Title",
            "Content"
        ]
    }
    if current_template == '':
        current_template = template_filenames[0]
    print(current_template)
    buttons = template_buttons[current_template]
    context = {"template_filenames":template_filenames,
               "buttons":buttons,
               "current_template":current_template}
    return render(request, 'record/index.html', context)

def receive(request):
    context_instance=RequestContext(request)
    print(request.FILES.get('data1'))
    data1 = request.FILES.get('data1').read() #This data is blob
    data2 = request.FILES.get('data2').read()  # This data is blob
    curtemp= request.POST['template'];
    text1 = naive.parse_audio(config['NAVER_AI_API']['client_id'],\
                      config['NAVER_AI_API']['client_secret'],\
                      audio_bytes=data1, lang="Kor")
    text2 = naive.parse_audio(config['NAVER_AI_API']['client_id'], \
                              config['NAVER_AI_API']['client_secret'], \
                              audio_bytes=data2, lang="Kor")
    mdown = None
    if (curtemp == "title_template"):
        mdown = slidegen.title_slide(text1)
    if (curtemp == "paragraph_template"):
        mdown = slidegen.paragraph_slide(text1,[text2])
    if (curtemp == "list_template"):
        mdown = slidegen.list_slide(text1, text2)
    if (curtemp == "image_template"):
        mdown = slidegen.image_slide(text1, text2)

    slidegen.write_out(text_data = mdown)

    return JsonResponse({"msg":text1})