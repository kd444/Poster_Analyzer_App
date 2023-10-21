from django.db import models

# Create your models here.
from django.db import models

from django.db import models

class Poster(models.Model):
    image = models.ImageField(upload_to='uploads/')

    def __str__(self):
        return self.image.name