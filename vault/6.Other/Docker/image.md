```sh
sudo docker run -it -d -p os-port:image-port img-name 
```

```sh
docker build .
```

```sh
docker image ls
```

```sh
docker network inspect image_id
```

```sh
sudo docker exec -it container_id /bin/bash
```

Creating new image from running container.
```sh
sudo docker commit container-name  new-img-name
```

Now image to file.
```sh
sudo docker save new-img-name  -o new-img-name.tar
```

```
sudo docker container ls -a
```