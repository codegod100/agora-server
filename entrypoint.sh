#!/bin/bash
#
# Caveats in run.sh apply :)
#
# For a supported way to run an Agora on containers, please refer to [[agora recipe]] for [[coop cloud]] in the Agora of Flancia: https://anagora.org/agora-recipe

npm run build
export FLASK_APP=app
export FLASK_ENV="production"
export AGORA_CONFIG="ProductionConfig"
poetry run flask run -h 0.0.0.0 -p 5017
