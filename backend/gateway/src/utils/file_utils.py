ALLOWED_EXTENSIONS = {'nii', 'nii.gz'}

def allowed_file(filename):
    if '.' not in filename:
        return False
    extension = filename.rsplit('.', 1)[-1].lower()
    if extension == 'gz':
        return filename.rsplit('.', 2)[-2].lower() == 'nii'
    return extension in ALLOWED_EXTENSIONS