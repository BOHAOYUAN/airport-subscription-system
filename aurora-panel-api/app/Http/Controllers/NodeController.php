<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Node;
use App\Models\User;

class NodeController extends Controller
{
    /**
     * Pull users from database for a specific node
     */
    public function getUsers(Request $request)
    {
        $nodeKey = $request->header('X-Node-Key');
        $nodeId = $request->query('node_id');
        
        // Verify secure handshake key
        $node = Node::where('id', $nodeId)->where('key', $nodeKey)->first();
        if (!$node) {
            return response()->json(['message' => 'Unauthorized node connection.'], 401);
        }
        
        // Return active users (not expired, has traffic)
        $users = User::where('enable', 1)
                     ->where('u', '+', 'd', '<', 'transfer_enable')
                     ->select('id', 'uuid', 'port', 'speed_limit')
                     ->get();
                     
        return response()->json([
            'users' => $users
        ], 200);
    }
}
