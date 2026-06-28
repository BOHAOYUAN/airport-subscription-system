import time
import requests

PANEL_URL = "http://your-panel.com/api/v1/node"
NODE_KEY = "node_secure_auth_key_12345"
NODE_ID = 5

class NodeDaemon:
    def __init__(self):
        self.headers = {"X-Node-Key": NODE_KEY, "Content-Type": "application/json"}
        
    def sync_users(self):
        url = f"{PANEL_URL}/users?node_id={NODE_ID}"
        try:
            res = requests.get(url, headers=self.headers, timeout=5)
            if res.status_code == 200:
                user_list = res.json().get("users", [])
                print(f"Successfully synced {len(user_list)} active users.")
                return user_list
        except Exception as e:
            print(f"Sync users failed: {e}")
        return []

    def report_traffic(self, traffic_data):
        url = f"{PANEL_URL}/traffic"
        payload = {
            "node_id": NODE_ID,
            "data": traffic_data
        }
        try:
            res = requests.post(url, headers=self.headers, json=payload, timeout=5)
            if res.status_code == 200:
                print("Traffic data reported successfully.")
                return True
        except Exception as e:
            print(f"Report traffic failed: {e}")
        return False

if __name__ == '__main__':
    daemon = NodeDaemon()
    print("Aurora Node Daemon Started. Syncing configuration...")
    # Mock loop run
    users = daemon.sync_users()
