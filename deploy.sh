#!/bin/bash
# This is the ultimate command, specifying the target, project, and token all at once.

echo "🚀 Attempting the ultimate deployment command..."

# We are being extra redundant by specifying the target, the project, and the token
# to overcome the CLI's unstable behavior in this environment.
firebase deploy --only hosting:app --project aicheck-squad --token "4/0AVGzR1AN2ptanedrBTT9Rscmw516e8wI7vO4HS5IpMOomrIRfZbX9Qp8JfPef4QDLDOcbQ"

echo "✅ Deployment process finished."
