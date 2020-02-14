import argparse

import os
import cv2
import numpy as np
import tensorflow as tf
import neuralgym as ng
import tqdm

from inpaint_model import InpaintCAModel

#def dir_path(string):
#    if os.path.isdir(string):
#        return string
#    else:
#        raise NotADirectoryError(string)

parser = argparse.ArgumentParser()
"""""
parser.add_argument('--image', default='', type=str,
                    help='The filename of image to be completed.')
parser.add_argument('--mask', default='', type=str,
                    help='The filename of mask, value 255 indicates mask.')
parser.add_argument('--output', default='output.png', type=str,
                    help='Where to write output.')
"""""
parser.add_argument('--image', default='/image', type=str,
                    help='The directory of image to be completed.')
parser.add_argument('--mask', default='/mask', type=str,
                    help='The directory of mask, value 255 indicates mask.')
parser.add_argument('--input', default='/result', type=str,
                    help='The directory of image and mask.')
parser.add_argument('--output', default='/output', type=str,
                    help='Where to write output.')
parser.add_argument('--checkpoint_dir', default='', type=str,
                    help='The directory of tensorflow checkpoint.')


if __name__ == "__main__":
    FLAGS = ng.Config('inpaint.yml')
    # ng.get_gpus(1)
    args, unknown = parser.parse_known_args()
    image_path = args.image
    mask_path = args.mask
    #input_path = args.input
    output_path = args.output

    model = InpaintCAModel()
    #input_list = os.listdir(input_path)
    #img_folder_list = sorted([img_path for img_path in input_list if img_path.startswith('result_img')])
    #msk_folder_list = sorted([msk_path for msk_path in input_list if msk_path.startswith('result_mask')])
    #assert len(img_folder_list) == len(msk_folder_list)
    if not os.path.exists(output_path):
        os.mkdir(output_path)
    #imgs = sorted([img for img in input_list if img.endswith("img.png")])
    #masks = sorted([msk for msk in input_list if msk.endswith("mask.png")])
    img_list = os.listdir(image_path)
    imgs = sorted([img for img in img_list if img.endswith(".png")])
    mask_list = os.listdir(mask_path)
    masks = sorted([msk for msk in mask_list if msk.endswith(".png")])
    assert len(imgs) == len(masks)

    sess_config = tf.ConfigProto()
    sess_config.gpu_options.allow_growth = True
    with tf.Session(config=sess_config) as sess:
        ith = 1
        """""
        for ith_folder in tqdm.tqdm(range(len(img_folder_list))):
            image_path = os.path.join(input_path, img_folder_list[ith_folder])
            mask_path = os.path.join(input_path, msk_folder_list[ith_folder])

            img_list = os.listdir(image_path)
            imgs = sorted([img for img in img_list if img.endswith(".png")])
            mask_list = os.listdir(mask_path)
            masks = sorted([msk for msk in mask_list if msk.endswith(".png")])
            assert len(imgs) == len(masks)
        """
        for ith_file in tqdm.tqdm(range(len(imgs))):
            # image = cv2.imread(os.path.join(input_path, imgs[ith_file]))
            # mask = cv2.imread(os.path.join(input_path, masks[ith_file]))
            image = cv2.imread(os.path.join(image_path, imgs[ith_file]))
            mask = cv2.imread(os.path.join(mask_path, masks[ith_file]))
            # mask = cv2.resize(mask, (0,0), fx=0.5, fy=0.5)

            assert image.shape == mask.shape

            h, w, _ = image.shape
            grid = 8
            image = image[:h // grid * grid, :w // grid * grid, :]
            mask = mask[:h // grid * grid, :w // grid * grid, :]
            # print('Shape of image: {}'.format(image.shape))

            image = np.expand_dims(image, 0)
            mask = np.expand_dims(mask, 0)
            input_image = np.concatenate([image, mask], axis=2)
            input_image = tf.constant(input_image, dtype=tf.float32)

            if ith == 1:
                output = model.build_server_graph(FLAGS, input_image)
            else:
                output = model.build_server_graph(FLAGS, input_image, reuse=True)
            output = (output + 1.) * 127.5
            output = tf.reverse(output, [-1])
            output = tf.saturate_cast(output, tf.uint8)

            # load pretrained model
            if ith == 1:
                vars_list = tf.get_collection(tf.GraphKeys.GLOBAL_VARIABLES)
                assign_ops = []
                for var in vars_list:
                    vname = var.name
                    from_name = vname
                    var_value = tf.contrib.framework.load_variable(args.checkpoint_dir, from_name)
                    assign_ops.append(tf.assign(var, var_value))
                sess.run(assign_ops)
                ith += 1
                # print('Model loaded.')

            result = sess.run(output)
            # cv2.imwrite(args.output, result[0][:, :, ::-1])
            cv2.imwrite(os.path.join(output_path, "Inpainted_" + imgs[ith_file]), result[0][:, :, ::-1])


