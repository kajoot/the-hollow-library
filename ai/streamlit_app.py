import streamlit as st
import requests
import json
from datetime import datetime
import os

# ============================================================================
# THE HOLLOW LIBRARY - STREAMLIT FRONTEND
# ============================================================================

# Page config
st.set_page_config(
    page_title="The Hollow Library",
    page_icon="📚",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# API Configuration
API_BASE_URL = os.getenv("API_URL", "http://localhost:8000/api")
AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:5000")

# Custom CSS for styling
st.markdown("""
<style>
    /* Dark theme with gold accents */
    :root {
        --primary-color: #FFD700;
        --dark-bg: #1a1a2e;
        --darker-bg: #0f0f1e;
        --accent-color: #00d4ff;
    }
    
    .main {
        background-color: #1a1a2e;
        color: #e0e0e0;
    }
    
    .stButton > button {
        background: linear-gradient(to right, #d4af37, #ffd700);
        color: #000;
        font-weight: bold;
        border-radius: 8px;
        border: none;
        padding: 10px 20px;
        transition: all 0.3s;
    }
    
    .stButton > button:hover {
        background: linear-gradient(to right, #ffd700, #ffed4e);
        box-shadow: 0 0 15px #FFD700;
    }
    
    .stTextInput > div > div > input,
    .stTextArea > div > div > textarea {
        background-color: rgba(0, 0, 0, 0.6) !important;
        border: 2px solid #FFD700 !important;
        color: #ffd700 !important;
        border-radius: 8px !important;
    }
    
    .stTextInput > div > div > input::placeholder,
    .stTextArea > div > div > textarea::placeholder {
        color: #FFD700 !important;
        opacity: 0.5;
    }
    
    .toxic-message {
        background-color: rgba(220, 38, 38, 0.2);
        border-left: 4px solid #dc2626;
        padding: 12px;
        border-radius: 6px;
        margin: 10px 0;
    }
    
    .safe-message {
        background-color: rgba(34, 197, 94, 0.1);
        border-left: 4px solid #22c55e;
        padding: 12px;
        border-radius: 6px;
        margin: 10px 0;
    }
    
    .title-main {
        text-align: center;
        color: #FFD700;
        font-size: 3em;
        font-weight: bold;
        text-shadow: 0 0 10px #FFD700;
        margin-bottom: 10px;
    }
    
    .house-badge {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: bold;
        margin: 5px;
    }
    
    .gryffindor { background-color: #740001; color: #d3a625; }
    .slytherin { background-color: #1a472a; color: #aaaaaa; }
    .hufflepuff { background-color: #3d2817; color: #f0c75e; }
    .ravenclaw { background-color: #0e1a40; color: #946b2d; }
</style>
""", unsafe_allow_html=True)

# ============================================================================
# SESSION STATE & INITIALIZATION
# ============================================================================

if "user" not in st.session_state:
    st.session_state.user = None
if "token" not in st.session_state:
    st.session_state.token = None
if "page" not in st.session_state:
    st.session_state.page = "login"
if "messages" not in st.session_state:
    st.session_state.messages = []

# ============================================================================
# API FUNCTIONS
# ============================================================================

def register_user(username: str, email: str, password: str, house: str):
    """Register a new user"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/register",
            json={
                "username": username,
                "email": email,
                "password": password,
                "password2": password,
                "house": house
            },
            timeout=10
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def login_user(username: str, password: str):
    """Login user"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/login",
            json={"username": username, "password": password},
            timeout=10
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def get_profile():
    """Get user profile"""
    try:
        response = requests.get(
            f"{API_BASE_URL}/profile",
            headers={"Authorization": f"Bearer {st.session_state.token}"},
            timeout=10
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def get_messages(house: str = "general"):
    """Get messages for a house"""
    try:
        response = requests.get(
            f"{API_BASE_URL}/messages?house={house}",
            headers={"Authorization": f"Bearer {st.session_state.token}"},
            timeout=10
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def post_message(content: str, house: str = "general"):
    """Post a message"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/messages",
            json={"content": content, "house": house},
            headers={"Authorization": f"Bearer {st.session_state.token}"},
            timeout=10
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def check_toxicity(text: str):
    """Check if text is toxic"""
    try:
        response = requests.post(
            f"{AI_SERVICE_URL}/predict",
            json={"text": text},
            timeout=10
        )
        result = response.json()
        prediction = result.get("prediction", 1)
        return prediction == 0  # True if toxic (0=negative)
    except Exception as e:
        st.warning(f"AI service unavailable: {e}")
        return False

# ============================================================================
# PAGE: LOGIN
# ============================================================================

def page_login():
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        st.markdown('<div class="title-main">🏰 The Hollow Library</div>', unsafe_allow_html=True)
        st.markdown("---")
        
        tab1, tab2 = st.tabs(["Login", "Register"])
        
        # LOGIN TAB
        with tab1:
            st.subheader("Enter the Castle")
            username = st.text_input("Username", key="login_username")
            password = st.text_input("Password", type="password", key="login_password")
            
            if st.button("Enter Castle", use_container_width=True):
                if not username or not password:
                    st.error("Please enter username and password")
                else:
                    result = login_user(username, password)
                    
                    if "error" in result or "access" not in result:
                        st.error(result.get("error", "Login failed"))
                    else:
                        st.session_state.token = result["access"]
                        st.session_state.user = result["user"]
                        st.session_state.page = "dashboard"
                        st.rerun()
        
        # REGISTER TAB
        with tab2:
            st.subheader("Join the Library")
            username = st.text_input("Choose Username", key="reg_username")
            email = st.text_input("Email Address", key="reg_email")
            password = st.text_input("Password", type="password", key="reg_password")
            
            st.markdown("**Select Your House:**")
            col1, col2, col3, col4 = st.columns(4)
            house = None
            
            with col1:
                if st.button("🦁 Gryffindor"):
                    house = "gryffindor"
            with col2:
                if st.button("🐍 Slytherin"):
                    house = "slytherin"
            with col3:
                if st.button("🦡 Hufflepuff"):
                    house = "hufflepuff"
            with col4:
                if st.button("🦅 Ravenclaw"):
                    house = "ravenclaw"
            
            if st.button("Create Account", use_container_width=True):
                if not all([username, email, password, house]):
                    st.error("Please fill all fields and select a house")
                else:
                    result = register_user(username, email, password, house)
                    
                    if "error" in result:
                        st.error(result["error"])
                    elif "access" in result:
                        st.session_state.token = result["access"]
                        st.session_state.user = result["user"]
                        st.session_state.page = "dashboard"
                        st.rerun()
                    else:
                        st.error("Registration failed")

# ============================================================================
# PAGE: DASHBOARD
# ============================================================================

def page_dashboard():
    user = st.session_state.user
    
    # Header
    col1, col2, col3 = st.columns([2, 2, 1])
    
    with col1:
        st.markdown(f'<div class="title-main">📚 The Hollow Library</div>', unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"**Welcome, {user['username']}!**")
        house_class = user.get('house', 'general').lower()
        st.markdown(f'<span class="house-badge {house_class}">{user.get("house", "Unknown").upper()}</span>', unsafe_allow_html=True)
        
        if st.button("Logout"):
            st.session_state.user = None
            st.session_state.token = None
            st.session_state.page = "login"
            st.rerun()
    
    st.markdown("---")
    
    # Main Content
    st.subheader("📬 Message Board")
    
    # House Selection
    houses = ["general", "gryffindor", "slytherin", "hufflepuff", "ravenclaw"]
    selected_house = st.selectbox("Select House Channel", houses, format_func=lambda x: x.title() if x != "general" else "General")
    
    col1, col2 = st.columns([3, 1])
    
    # Post Message
    with col1:
        new_message = st.text_area("Share your thoughts...", placeholder="Type your message here", height=100)
    
    with col2:
        st.write("")
        st.write("")
        post_btn = st.button("Post Message", use_container_width=True)
    
    if post_btn:
        if not new_message.strip():
            st.error("Message cannot be empty")
        else:
            # Check toxicity
            is_toxic = check_toxicity(new_message)
            
            if is_toxic:
                st.error("❌ Your message was flagged as toxic and violates community guidelines!")
            else:
                result = post_message(new_message, selected_house)
                
                if "error" in result:
                    st.error(f"Failed to post: {result['error']}")
                else:
                    st.success("✅ Message posted!")
                    st.rerun()
    
    # Display Messages
    st.markdown("---")
    st.subheader(f"Messages in {selected_house.title()}")
    
    messages = get_messages(selected_house)
    
    if isinstance(messages, list):
        if len(messages) == 0:
            st.info("No messages yet. Be the first to speak!")
        else:
            for msg in messages[::-1]:  # Reverse to show newest first
                author = msg.get("author", {})
                content = msg.get("content", "")
                timestamp = msg.get("createdAt", "")
                
                # Format timestamp
                if timestamp:
                    dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    time_str = dt.strftime("%H:%M %d/%m/%y")
                else:
                    time_str = "Recently"
                
                with st.container():
                    col1, col2 = st.columns([1, 5])
                    
                    with col1:
                        if isinstance(author, dict):
                            username = author.get("username", "Anonymous")
                        else:
                            username = str(author)
                        
                        st.write(f"**{username}**")
                    
                    with col2:
                        st.write(content)
                        st.caption(time_str)
                    
                    st.markdown("---")
    else:
        st.error("Failed to load messages")

# ============================================================================
# MAIN APP
# ============================================================================

def main():
    # Check if user is logged in
    if st.session_state.user is None:
        page_login()
    else:
        page_dashboard()

if __name__ == "__main__":
    main()
