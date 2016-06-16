# Fishnet - staging intranet branch

A branch of *Eileen Fisher's* intranet site repo for intern Frank to not mess everything up!

Currently working on:
- Searchable "tags"
- Permissions in search
- Using SQL "REPLACE" to account for samey tag searches

Progress:
- Tags are currently searchable! XD
	- Tags have a relevance of "1"
	- Tags are grouped by "page_id"
		- The entry with largest "relevance" is taken, rest are dropped
- searchindex (which contains the rebuild search index function) should now rebuild with needed info
	- Rebuilds with tag_name and access now!
- Permissions and "access" should now be considered in search!

Changes:
- SET GLOBAL max_allowed_packet=1073741824, to allow for larger search index!