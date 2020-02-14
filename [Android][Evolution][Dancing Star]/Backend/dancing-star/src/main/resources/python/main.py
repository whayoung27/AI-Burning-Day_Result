import numpy as np
import sys
import cv2
import requests
import json
import argparse
from numpy.linalg import norm

# calculate.py
def eu_dist(p1, p2):
    
    p1 = np.array(p1)
    p2 = np.array(p2)

    p1p2 = p2 - p1
    return norm(p1p2)


def angle(p1, origin, p2):
    try:
        p1 = np.array(p1)
        o = np.array(origin)
        p2 = np.array(p2)
        
        op1 = p1 - o
        op2 = p2 - o
        cosine = np.dot(op1, op2) / (norm(op1)*norm(op2))
     
        
        # v1, v2 should be unit vector
        return np.degrees(np.arccos(cosine))
    except TypeError:
        return 0

def normalize(vector):
    normal = []
    for i in range(len(vector)):
        if vector[i] == [None, None]:
            normal.append([None, None])
            continue
        l2norm = norm(vector[i])
        normal.append([vector[i][0] / l2norm, vector[i][1] / l2norm])

    return normal
    
    
def distance(userConfs, dnPointsNorm, userPointsNorm, nPoints=18):
    dist = 0.
    conf_sum = 0
    for i in range(nPoints):
        try:
            dist += userConfs[i] * eu_dist(dnPointsNorm[i], userPointsNorm[i])
        except TypeError:
            continue

    for i in range(nPoints):
        try:
            conf_sum += userConfs[i]
        except TypeError:
            continue
    if dist == 0:
        return 20
    return conf_sum / dist

def leg_dist(kp):
    if kp[1] == [None, None] or kp[4] == [None, None]:
        if kp[2] == [None, None] or kp[5] == [None, None] :
            return -1
        return eu_dist(kp[2], kp[5])
    return eu_dist(kp[1], kp[4])

def arm_dist(kp):
    if kp[2] == [None, None] or kp[5] == [None, None]:
        if kp[3] == [None, None] or kp[6] == [None, None] :
            return -1
        return eu_dist(kp[3], kp[6])
    return eu_dist(kp[2], kp[5])
    
def legs_angle(kp):
    right_angle = 0
    left_angle = 0
    
    if kp[1] == [None, None]:
        flag = False
        if kp[2] == [None, None]:
            right_angle = 0.
        else:
            right_angle = angle(kp[2], kp[0], kp[3])
        left_angle = angle(kp[0], kp[3], kp[4])
        
    if kp[4] == [None, None]:
        flag = False
        if kp[5] == [None, None]:
            left_angle = 0.
        else:
            left_angle = angle(kp[0], kp[3], kp[5])
        right_angle = angle(kp[1], kp[0], kp[3])
        
    if kp[1] != [None, None] and kp[4] != [None, None]:
        right_angle = angle(kp[1], kp[0], kp[3])
        left_angle = angle(kp[0], kp[3], kp[4])

    return right_angle, left_angle

def arms_angle(kp):
    right_angle = 0
    left_angle = 0
    right_arm = kp[:4]
    left_arm = [kp[0]]
    left_arm.append(kp[4])
    left_arm.append(kp[5])
    left_arm.append(kp[6])

    new_right = []
    new_left = []

    for i in range(4):
        if right_arm[i] == [None, None]:
            continue
        else:
            new_right.append(right_arm[i])
            
    for i in range(4):
        if left_arm[i] == [None, None]:
            continue
        else:
            new_left.append(left_arm[i])

    if len(new_right) < 3 :
        right_angle = 0
    else:
        right_angle = angle(new_right[0], new_right[1], new_right[2])
   
    if len(new_left) < 3 :
        left_angle = 0
    else:
        left_angle = angle(new_left[0], new_left[1], new_left[2])
        

    return right_angle, left_angle

def gaze(nose, neck):
    try:
        if nose[0] < neck[0] : # 코가 목의 왼쪽에 있을때
            return 1
        elif nose[0] > neck[0]: # 코가 목의 오른쪽에 있을때
            return 2
        else:
            return 3
    except TypeError:
        return 0


# score.py
def leg_angle_score(d_rightLegAngle, d_leftLegAngle, u_rightLegAngle, u_leftLegAngle):
    right_diff = abs(d_rightLegAngle - u_rightLegAngle)
    left_diff = abs(d_leftLegAngle - u_leftLegAngle)
    right_score = 0
    left_score = 0
    if right_diff < 10:
        right_score = 150
    elif right_diff <15:
        right_score = 130
    elif right_diff <20:
        right_score = 110
    elif right_diff <25:
        right_score = 90
    else:
        right_score = 0

    if left_diff < 10:
        left_score = 150
    elif left_diff <15:
        left_score = 130
    elif left_diff <20:
        left_score = 110
    elif left_diff <25:
        left_score = 90
    else:
        left_score = 0

    
    return left_score + right_score

def arm_angle_score(d_rightArmAngle, d_leftArmAngle, u_rightArmAngle, u_leftArmAngle):
    right_diff = abs(d_rightArmAngle - u_rightArmAngle)
    left_diff = abs(d_leftArmAngle - u_leftArmAngle)
    right_score = 0
    left_score = 0
    if right_diff < 10:
        right_score = 150
    elif right_diff <15:
        right_score = 130
    elif right_diff <20:
        right_score = 110
    elif right_diff <25:
        right_score = 90
    else:
        right_score = 0

    if left_diff < 10:
        left_score = 150
    elif left_diff <15:
        left_score = 130
    elif left_diff <20:
        left_score = 110
    elif left_diff <25:
        left_score = 90
    else:
        left_score = 0

    
    return left_score + right_score

def distance_score(d_armDist, u_armDist, d_legDist, u_legDist):
    arm_score = 0
    leg_score = 0
    arm_diff = abs(100*d_armDist - 100*u_armDist)
    leg_diff = abs(100*d_legDist - 100*u_legDist)

    if arm_diff < 5:
        arm_score = 100
    elif arm_diff <10:
        arm_score = 80
    elif arm_diff <15:
        arm_score = 60
    elif arm_diff <20:
        arm_score = 40
    else:
        arm_score = 0

    if leg_diff < 5:
        leg_score = 100
    elif leg_diff <10:
        leg_score = 80
    elif leg_diff <15:
        leg_score = 60
    elif leg_diff <20:
        leg_score = 40
    else:
        leg_score = 0

    return arm_score + leg_score


def Accuracy(leg_score, arm_score, dist_score):
    return leg_score + arm_score + dist_score

def Consistency(similarity):
    return similarity

def hidden1(face1, face2):
    if face1 == face2:
        return 100

def hidden2(gaze1, gaze2):
    if gaze1 == 0 or gaze2 == 0:
        return 0
    if gaze1 == gaze1:
        return 100



def main(pose1, pose2, face1, face2):

    dance_pose = json.loads(pose1)
    user_pose = json.loads(pose2)
    dance_face = json.loads(face1)
    user_face = json.loads(face2)

    nPoints = 18



   
    # receive dance video api data
    try:
        face = dance_face['faces'][0]['emotion']
        dance_emotion = face['value']
    except IndexError:
        dance_emotion = None
    personKP = dance_pose['predictions'][0]
    dnConfs = []
    dnPoints = []
    for i in range(18):
        try:
            dnPoints.append([personKP[str(i)]['x'], personKP[str(i)]['y']])
            dnConfs.append(personKP[str(i)]['score'])
        except KeyError:
            dnPoints.append([None, None])
            dnConfs.append(None)

            
    # receive user video api data
    try:
        face = user_face['faces'][0]['emotion']
        user_emotion = face['value']
    except IndexError:
        user_emotion = None
   
    personKP = user_pose['predictions'][0]
    userConfs = []
    userPoints = []
    for i in range(18):
        try:
            userPoints.append([personKP[str(i)]['x'], personKP[str(i)]['y']])
            userConfs.append(personKP[str(i)]['score'])
        except KeyError:
            userPoints.append([None, None])
            userConfs.append(None)

            
    # Normalize
    dnPointsNorm = normalize(dnPoints)
    userPointsNorm = normalize(userPoints)


    # Split part
    d_face = np.vstack([dnPointsNorm[0], dnPointsNorm[14:18]])
    d_torso = dnPointsNorm[1:8]
    d_legs = dnPointsNorm[8:14]
    u_face = np.vstack([userPointsNorm[0], userPointsNorm[14:18]])
    u_torso = userPointsNorm[1:8]
    u_legs = userPointsNorm[8:14]

    d_rightLegAngle, d_leftLegAngle = legs_angle(d_legs)
    u_rightLegAngle, u_leftLegAngle = legs_angle(u_legs)
    d_rightArmAngle, d_leftArmAngle = arms_angle(d_torso)
    u_rightArmAngle, u_leftArmAngle = arms_angle(u_torso)
    d_armDist = arm_dist(d_torso)
    u_armDist = arm_dist(u_torso)
    d_legDist = leg_dist(d_legs)
    u_legDist = leg_dist(u_legs)

    d_gaze = gaze(d_face[0], d_torso[0])
    u_gaze = gaze(u_face[0], u_torso[0])

    similarity = distance(userConfs, dnPointsNorm, userPointsNorm)

    h1 = hidden1(dance_emotion, user_emotion)
    h2 = hidden2(d_gaze, u_gaze)
    leg_score = leg_angle_score(d_rightLegAngle, d_leftLegAngle, u_rightLegAngle, u_leftLegAngle)
    arm_score = arm_angle_score(d_rightArmAngle, d_leftArmAngle, u_rightArmAngle, u_leftArmAngle)
    dist_score = distance_score(d_armDist, u_armDist, d_legDist, u_legDist)
    accuracy = Accuracy(leg_score, arm_score, dist_score)
    consistency = Consistency(similarity)

    print("h1 : ", h1)
    print("h2 : ", h2)
    print("accuracy : ", accuracy)
    print("consistency : ", consistency)
    
        
if __name__ == '__main__':
  main(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])

