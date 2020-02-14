def get_intersection_area(r1, r2):
    x1, y1, x2, y2 = r1
    a1, b1, a2, b2 = r2

    bottom = max(x1, a1)
    top = min(x2, a2)
    left = max(y1, b1)
    right = min(y2, b2)

    if left <= right and bottom <= top:
        return (right-left)*(top-bottom)
    
    return 0


def checkTrait(c):
    return (int((ord(c) - 0xAC00) % 28) != 0)


## use object box data to make string, representing object positions
def get_object_positioned_string(object_info):
    
    ## 0:left, 1:middle, 2:right
    pos_idx = []
    for a in range(3):
        pos_idx.append([])
    ## for counting objects
    cnt_idx = []
    for a in range(3):
        cnt_idx.append([])

    idx = 0
    left = [0, 0, 1, 0.3333]
    middle = [0, 0.3333, 1, 0.6666]
    right = [0, 0.6666, 1, 1]
    # decide position by maximum intersecting area
    for l in object_info["positions"]:
        max_area = 0
        cur_area = 0
        chosen_idx = 0
        ## check left 
        cur_area = get_intersection_area(l, left)
        if cur_area > max_area:
            max_area = cur_area
            chosen_idx = 0

        ## check middle
        cur_area = get_intersection_area(l, middle)
        if cur_area > max_area:
            max_area = cur_area
            chosen_idx = 1

        ## check right
        cur_area = get_intersection_area(l, right)
        if cur_area > max_area:
            max_area = cur_area
            chosen_idx = 2

        if max_area <= 0.75:
            if object_info["names"][idx] in pos_idx[chosen_idx]:
                num_idx = pos_idx[chosen_idx].index(object_info["names"][idx])
                cnt_idx[chosen_idx][num_idx] += 1
            else:
                pos_idx[chosen_idx].append(object_info["names"][idx])
                cnt_idx[chosen_idx].append(1)

        idx += 1


    ## make text for audio
    ret_string = ""
    
    if len(pos_idx[0])>0:
        ret_string = "왼쪽에"
        for a in range(len(pos_idx[0])):
            ret_string += ", " + pos_idx[0][a] + " " + num_to_kor[cnt_idx[0][a]]

    if len(pos_idx[1])>0:
        ret_string += ". 중간에"
        for a in range(len(pos_idx[1])):
            ret_string += ", " + pos_idx[1][a] + " " + num_to_kor[cnt_idx[1][a]]

    if len(pos_idx[2])>0:
        ret_string += ". 오른쪽에"
        for a in range(len(pos_idx[2])):
            ret_string += ", " + pos_idx[2][a] + " " + num_to_kor[cnt_idx[2][a]]
    
    if ret_string != "":
        if checkTrait(ret_string[-1:]) == True:
            ret_string += "이 있습니다."
        else:
            ret_string += "가 있습니다."

    return ret_string





#### change int to korean counting number
num_to_kor = {
    1 : "하나",
    2 : "둘",
    3 : "셋",
    4 : "넷",
    5 : "다섯",
    6 : "여섯",
    7 : "일곱",
    8 : "여덟",
    9 : "아홉",
    10 : "열",
    11 : "열하나",
    12 : "열둘",
    13 : "열셋"
}

