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
- Maybe be able to restore from a provided tar file?

