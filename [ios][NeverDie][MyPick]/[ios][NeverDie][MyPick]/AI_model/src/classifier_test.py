import os
import classifier

if __name__ == '__main__':

    # Project root path to make it easier to reference files
    project_root_path = os.path.join(os.path.abspath(__file__), "..\\..")


    # Feel free to replace this and use actual commandline args instead, the main method will still work
    args = lambda: None
    args.data_dir = project_root_path + '\\training_data_aligned'
    args.seed = None
    args.use_split_dataset = False
    args.model = project_root_path + '\\facenet_model\\20180402-114759\\20180402-114759.pb'
    args.mode = 'CLASSIFY'
    args.batch_size = 460
    args.image_size = 160
    args.classifier_filename = project_root_path + '\\trained_classifier\\newglint_classifier.pkl'

    # Will go through all images in all the folders and classify them
    classifier.main(args)
