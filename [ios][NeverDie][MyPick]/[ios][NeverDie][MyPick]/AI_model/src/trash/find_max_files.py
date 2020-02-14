# import pathlib
# import shutil
#
# destination = "C:/Users/Frank/Documents/facenet_cropped/"
# path = pathlib.Path("C:/Users/Frank/Documents/lfw_cropped")
# folders = [(len(list(folder.iterdir())), folder) for folder in path.iterdir()]
# top_folders = list(sorted(folders, reverse=True))[:20]
# for subfiles, subpath in top_folders:
#     shutil.copytree(str(subpath), destination + subpath.stem)