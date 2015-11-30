# nodebb-backup
A simple backup script based on the steps described in https://docs.nodebb.org/vi/latest/upgrading/

# Install

npm install -g nodebb-backup

# Run (inside your nodebb folder)

nodebb-backup

# Features

- Backs up the mongo database specified in NodeBB's config.json file
- Backs up the nodebb/uploads directory which contains uploaded images
- Compresses dumped db and files from /uploads into a tar with a format like this: nodebb-backup-2015-09-01_1509-v0.7.3.tar
- Resulting tar file is saved to the directory above nodebb 

# Limitations

- Many, it's pretty raw!
- Mongo only
- No command line options yet

# Needed Features (please send me feedback)

- Be able to provide a path to place the resulting back up file
- Redis support
- Maybe be able to restore from a provided tar file?

# Unpacking tar to new directory, 'unpackeddir'

mkdir -p unpackeddir; tar -xvf nodebb-backup-2015-11-10_1532-v0.8.2.tar -C $_

# Restoring db (from inside unpacked directory created above)

mongorestore -d nodebb -u username -p password --dir=unpackeddir/nodebb --host=127.0.0.1:27017