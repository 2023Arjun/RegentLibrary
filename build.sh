#!/usr/bin/env bash
# Exit on error
set -o errexit

# 1. Install dependencies (pointing to your subfolder file)
pip install -r djangotutorial/requirements.txt

# 2. Collect static files (CSS/Images)
python manage.py collectstatic --no-input

# 3. Run Database Migrations
python manage.py migrate
