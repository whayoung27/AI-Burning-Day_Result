from record import nlp_utils as nu
from record import naver_api_utils as nau
import random
import configparser

config = configparser.ConfigParser()
config.read('record/config.ini')

## combining all presentation slides into one string
def generate_presentation_code(slides:list):
    return '\n---\n'.join(slides)


## combine title and whatever detail
def combine_title_element(title, element):
    return '#{}\n{}\n'.format(title, element)


## write to out file
def write_out(outfile='out.md', text_data=''):
    with open(outfile,'w') as f:
        f.write(text_data)
    return None


### for generating 4 different types of slides ###

def bullet_point_slide(title, sents):
    ranked = nu.textrank_keyword(sents,
                                 tokenize=nu.kkma_tokenize,
                                 min_count=2,
                                 window=2,
                                 min_cooccurrence=2,
                                 df=0.80,
                                 max_iter=30,
                                 topk=2)
    bpt = nu.generate_bullet_points(ranked, exclude=set([title]))
    return combine_title_element(title, bpt)

def image_slide(title, sents):
    ranked = nu.textrank_keyword(sents,
                                 tokenize=nu.kkma_tokenize,
                                 min_count=2,
                                 window=2,
                                 min_cooccurrence=2,
                                 df=0.80,
                                 max_iter=30,
                                 topk=2)
    keywords = nu.get_keywords_list(ranked, exclude=set([title]))
    if len(keywords) < 1:
        return combine_title_element(title, '')
    image_word = keywords[random.randint(0, min(len(keywords) - 1, 0))]
    image_script = nau.generate_image(search_text=image_word, client_id=config['NAVER_API']['client_id'],
                                      client_secret=config['NAVER_API']['client_secret'])
    return combine_title_element(title, image_script)

def title_slide(title):
    return "# {}".format(title)

def paragraph_slide(title, paragraphs):
    return combine_title_element(title, '<br />'.join(paragraphs))
