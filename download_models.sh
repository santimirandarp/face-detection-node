#!/usr/bin/env bash
# script downloads the files in the current directory !!

# model names can be build automatically in the browser console
filenames=("age_gender_model-shard1" "age_gender_model-weights_manifest.json" "face_expression_model-shard1" "face_expression_model-weights_manifest.json" "face_landmark_68_model-shard1" "face_landmark_68_model-weights_manifest.json" "face_landmark_68_tiny_model-shard1" "face_landmark_68_tiny_model-weights_manifest.json" "face_recognition_model-shard1" "face_recognition_model-shard2" "face_recognition_model-weights_manifest.json" "mtcnn_model-shard1" "mtcnn_model-weights_manifest.json" "ssd_mobilenetv1_model-shard1" "ssd_mobilenetv1_model-shard2" "ssd_mobilenetv1_model-weights_manifest.json" "tiny_face_detector_model-shard1" "tiny_face_detector_model-weights_manifest.json")

# this is the url to the "raw" files
baseUrl=https://github.com/justadudewhohacks/face-api.js/raw/master/weights

for i in "${filenames[@]}"
do
   echo "Downloading $i"
   # -O removes the basename
   curl -L -O "${baseUrl}/$i"
done

