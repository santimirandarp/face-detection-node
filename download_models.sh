#!/usr/bin/env bash
# script downloads the files in the current directory !!

# model names can be build automatically in the browser console or parsing the html
filenames=("age_gender_model-weights_manifest.json" "age_gender_model.bin" "face_expression_model-weights_manifest.json" "face_expression_model.bin" "face_landmark_68_model-weights_manifest.json" "face_landmark_68_model.bin" "face_landmark_68_tiny_model-weights_manifest.json" "face_landmark_68_tiny_model.bin" "face_recognition_model-weights_manifest.json" "face_recognition_model.bin" "ssd_mobilenetv1_model-weights_manifest.json" "ssd_mobilenetv1_model.bin" "tiny_face_detector_model-weights_manifest.json" "tiny_face_detector_model.bin")


# this is the url to the "raw" files, i.e must contain the `.../raw/...` in the URL path, see
# example below
baseUrl=https://github.com/vladmandic/face-api/raw/master/model/

# Where to store the results
pathToOutDir="src/models"
cd "${pathToOutDir}"
echo "current dir is ${PWD}"

# expand the array for iteration
for i in "${filenames[@]}"
do
   echo "Downloading $i"
   # -O finds the basename (basically uses ${i} as the filename
   curl -L -O "${baseUrl}/${i}"
done

