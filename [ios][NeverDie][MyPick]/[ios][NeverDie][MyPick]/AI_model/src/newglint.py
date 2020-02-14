import tensorflow as tf
import align.detect_face
import facenet
import cv2
import numpy as np
from color_extractor import _colorExtractor
from pose_estimation import _poseEstimation
from extract_time import extract_timedata
from videofile_trim import assemble_cuts
from moviepy.editor import VideoFileClip

import glob
import pickle
import collections
import os
from pytube import YouTube
# import ffmpeg

def main(args):
    minsize = 20
    threshold = [0.6, 0.7, 0.7]
    factor = 0.709
    image_size = 182
    input_image_size = 160

    #Jennie, Jisoo, Lisa, Rose
    color = [(0, 1, 2), (0, 1, 1), (1, 0, 3), (1, 1, 3)]

    _time = [[], [], [], []]

    # comment out these lines if you do not want video recording
    # USE FOR RECORDING VIDEO
    fourcc = cv2.VideoWriter_fourcc(*'X264')

    # Get the path of the classifier and load it
    project_root_folder = os.path.join(os.path.abspath(__file__), "..\\..")
    classifier_path = project_root_folder + "\\trained_classifier\\newglint_classifier.pkl"
    print (classifier_path)
    with open(classifier_path, 'rb') as f:
        (model, class_names) = pickle.load(f)
        print("Loaded classifier file")

    with tf.Graph().as_default():
        gpu_options = tf.GPUOptions(per_process_gpu_memory_fraction=0.6)
        sess = tf.Session(config=tf.ConfigProto(gpu_options=gpu_options, log_device_placement=False))
        with sess.as_default():
            # Bounding box
            pnet, rnet, onet = align.detect_face.create_mtcnn(sess, project_root_folder + "\\src\\align")
            # Get the path of the facenet model and load it
            facenet_model_path = project_root_folder + "\\facenet_model\\20180402-114759\\20180402-114759.pb"
            facenet.load_model(facenet_model_path)

            images_placeholder = tf.get_default_graph().get_tensor_by_name("input:0")
            embeddings = tf.get_default_graph().get_tensor_by_name("embeddings:0")
            phase_train_placeholder = tf.get_default_graph().get_tensor_by_name("phase_train:0")
            embedding_size = embeddings.get_shape()[1]

            # Start video capture
            people_detected = set()
            information_list = [] # idol member's appearance time

            person_detected = collections.Counter()

            if args.webcam is True:
                video_capture = cv2.VideoCapture(0)
            else:
                video_path = project_root_folder + "\\test_data\\video\\"
                video_name = "test"
                full_original_video_path_name = video_path + video_name + '.mp4'
                video_capture_path = full_original_video_path_name
                if not os.path.isfile(full_original_video_path_name):
                    print('Video not found at path ' + full_original_video_path_name + '. Commencing download from YouTube')
                    # Note if the video ever gets removed this will cause issues
                    YouTube(args.youtube_video_url).streams.first().download(output_path =video_path, filename=video_name)
                video_capture = cv2.VideoCapture(full_original_video_path_name)
            width = video_capture.get(cv2.CAP_PROP_FRAME_WIDTH)  # float
            height = video_capture.get(cv2.CAP_PROP_FRAME_HEIGHT)  # float

            video_recording = cv2.VideoWriter(project_root_folder + '\\output.avi', fourcc, 10, (int(width), int(height)))

            total_frames_passed = 0

            while True:
                try:
                    ret, frame = video_capture.read()
                except Exception as e:
                    break

                # Skip frames if video is to be speed up
                if args.video_speedup:
                    total_frames_passed += 1
                    if total_frames_passed % args.video_speedup != 0:
                        continue

                # extract bb
                bounding_boxes, _ = align.detect_face.detect_face(frame, minsize, pnet, rnet, onet, threshold, factor)
                faces_found = bounding_boxes.shape[0]

                # time & name
                information_list.clear()
                duration = video_capture.get(cv2.CAP_PROP_POS_MSEC)
                msecs = int(duration % 1000) /1000
                seconds = int(duration / 1000 % 60)
                minutes = int(duration / 1000 /1000 % 60)
                hour =  int(duration / 1000 /1000 / 60)
                time = '{0}:{1}:{2}'.format(hour, minutes, seconds + msecs)
                information_list.append(time)

                if faces_found > 0:
                    det = bounding_boxes[:, 0:4]

                    # save .jpg
                    success, image = video_capture.read()
                    if success is False:
                        break
                    cv2.imwrite('frame.jpg', image)

                    bb = np.zeros((faces_found, 4), dtype=np.int32)
                    for i in range(faces_found):
                        bb[i][0] = det[i][0]
                        bb[i][1] = det[i][1]
                        bb[i][2] = det[i][2]
                        bb[i][3] = det[i][3]

                        # inner exception
                        if bb[i][0] <= 0 or bb[i][1] <= 0 or bb[i][2] >= len(frame[0]) or bb[i][3] >= len(frame):
                            print('face is inner of range!')
                            continue

                        cropped = frame[bb[i][1]:bb[i][3], bb[i][0]:bb[i][2], :]
                        scaled = cv2.resize(cropped, (input_image_size, input_image_size), interpolation=cv2.INTER_CUBIC)
                        # cv2.imshow("Cropped and scaled", scaled)
                        # cv2.waitKey(1)

                        scaled = facenet.prewhiten(scaled)
                        # cv2.imshow("\"Whitened\"", scaled)
                        # cv2.waitKey(1)

                        scaled_reshape = scaled.reshape(-1, input_image_size, input_image_size, 3)
                        feed_dict = {images_placeholder: scaled_reshape, phase_train_placeholder: False}
                        emb_array = sess.run(embeddings, feed_dict=feed_dict)
                        predictions = model.predict_proba(emb_array)
                        best_class_indices = np.argmax(predictions, axis=1)
                        best_class_probabilities = predictions[np.arange(len(best_class_indices)), best_class_indices]
                        best_name = class_names[best_class_indices[0]]

                        # probability
                        _isPerson = 0
                        # # extract shoulder x, y
                        if best_class_probabilities <= 0.5:
                            (s_x, s_y) = _poseEstimation('frame.jpg', det[i][0], det[i][2], det[i][1], det[i][3])
                            if (s_x, s_y) != (-1, -1):
                                temp = _colorhist('frame.jpg', s_x, s_y)
                                if color[best_class_indices[0]] == temp:
                                    _isPerson = 1
                        else:
                            _isPerson = 1

                        _time[best_class_indices[0]].append((time,_isPerson))
                        print((time,_isPerson))

                        information_list.append(best_name)

                        if best_class_probabilities > 0.09:
                            cv2.rectangle(frame, (bb[i][0], bb[i][1]), (bb[i][2], bb[i][3]), (0, 255, 0), 2)    #boxing face
                            text_x = bb[i][0]
                            text_y = bb[i][3] + 20
                            cv2.putText(frame, class_names[best_class_indices[0]], (text_x, text_y), cv2.FONT_HERSHEY_COMPLEX_SMALL,
                                        1, (0, 0, 255), thickness=1, lineType=2)
                            person_detected[best_name] += 1

                    # total_frames_passed += 1
                    # if total_frames_passed == 2:
                    for person, count in person_detected.items():
                        if count > 4:
                            # print("Person Detected: {}, Count: {}".format(person, count))
                            people_detected.add(person)
                    # person_detected.clear()
                    # total_frames_passed = 0

                # print time & name
                print(information_list)

                cv2.putText(frame, "People detected so far:", (20, 20), cv2.FONT_HERSHEY_PLAIN,
                            1, (255, 0, 0), thickness=1, lineType=2)
                currentYIndex = 40
                for idx, name in enumerate(people_detected):
                    cv2.putText(frame, name, (20, currentYIndex + 20 * idx), cv2.FONT_HERSHEY_PLAIN,
                                1, (0, 0, 255), thickness=1, lineType=2)
                cv2.imshow("Face Detection and Identification", frame)
                video_recording.write(frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

    # video editing
    project_root_path = os.path.join(os.path.abspath(__file__), "..\\..") + "test_Data\\video\\test.mp4"
    for i in range(4):
        time_data1 = [_time[i]]
        allthetime = extract_timedata(time_data1)
        assemble_cuts(project_root_path, allthetime, "final" + str(i) + ".mp4")


    video_recording.release()
    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    args = lambda : None
    args.video = True
    args.youtube_video_url = "https://www.youtube.com/watch?v=l3ORhQaMUR4"
    args.video_speedup = 30
    args.webcam = False
    main(args)