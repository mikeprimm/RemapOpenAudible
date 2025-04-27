# RemapOpenAudible
This script is a simple NodeJS script for mapping books from an OpenAudible (https://openaudible.org/) library into a file structure consistent with that used by AudioBookshelf (https://www.audiobookshelf.org/).  Specifically, this is intended to help with preserving series names and ordering, which is lost when just copying the files.

To run the script, be sure to have installed NodeJS (https://nodejs.org/) - any vaguely recent version should work.  Then to run the script, run

     node remapOpenAudible.js <directory of openaudible library> <destination path>

This process can take quite a while, and it is important to be sure the destination has enough space for the copied library.  The script does check to see if the destination already includes the intended files, so the script can be efficiently rerun as new books are converted by OpenAudible, only copying the files not already in the destination file tree.  This also makes the script restartable, so if the process is interrupted, just run the script again.

