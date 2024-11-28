import unittest
from gateway.src.utils.file_utils import allowed_file


class TestFileUtils(unittest.TestCase):

    def test_allowed_file(self):
        # Test cases for allowed file extensions
        self.assertTrue(allowed_file('test.nii'))
        self.assertTrue(allowed_file('test.nii.gz'))

        # Test cases for disallowed file extensions
        self.assertFalse(allowed_file('test.txt'))
        self.assertFalse(allowed_file('test.jpg'))
        self.assertFalse(allowed_file('test'))

        # Test cases for filenames with multiple dots
        self.assertTrue(allowed_file('test.file.nii'))
        self.assertFalse(allowed_file('test.file.txt'))


if __name__ == '__main__':
    unittest.main()