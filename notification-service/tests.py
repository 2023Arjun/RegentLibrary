import unittest

class NotificationTests(unittest.TestCase):
    def test_email_format(self):
        email = "user@example.com"
        self.assertIn("@", email)

if __name__ == '__main__':
    unittest.main()