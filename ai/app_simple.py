import streamlit as st
import random
from datetime import datetime

# ============================================================================
# THE HOLLOW LIBRARY - STREAMLIT DEMO (NO DATABASE NEEDED)
# FIXED: House selection now properly tracks state and shows confirmation
# ============================================================================

st.set_page_config(
    page_title="The Hollow Library",
    page_icon="📚",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
    .title-main {
        text-align: center;
        color: #FFD700;
        font-size: 2.5em;
        font-weight: bold;
        text-shadow: 0 0 10px #FFD700;
    }
    
    .house-badge {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: bold;
    }
    
    .gryffindor { background-color: #740001; color: #d3a625; }
    .slytherin { background-color: #1a472a; color: #aaaaaa; }
    .hufflepuff { background-color: #3d2817; color: #f0c75e; }
    .ravenclaw { background-color: #0e1a40; color: #946b2d; }
    
    .toxic-message {
        background-color: rgba(220, 38, 38, 0.2);
        border-left: 4px solid #dc2626;
        padding: 12px;
        border-radius: 6px;
    }
    
    .safe-message {
        background-color: rgba(34, 197, 94, 0.1);
        border-left: 4px solid #22c55e;
        padding: 12px;
        border-radius: 6px;
    }
</style>
""", unsafe_allow_html=True)

# ============================================================================
# SESSION STATE
# ============================================================================

if "logged_in" not in st.session_state:
    st.session_state.logged_in = False
if "username" not in st.session_state:
    st.session_state.username = None
if "house" not in st.session_state:
    st.session_state.house = None
if "messages" not in st.session_state:
    st.session_state.messages = [
        {"user": "Hermione", "house": "gryffindor", "text": "Welcome to the library!", "time": "10:30"},
        {"user": "Draco", "house": "slytherin", "text": "Dark magic is the way", "flagged": True, "time": "10:25"},
        {"user": "Luna", "house": "ravenclaw", "text": "The castle whispers secrets", "time": "10:20"},
    ]
if "selected_house_register" not in st.session_state:
    st.session_state.selected_house_register = None

# ============================================================================
# TOXICITY DETECTION (SIMPLE - NO API NEEDED)
# ============================================================================

def check_toxicity(text):
    """Simple toxicity check based on keywords"""
    toxic_words = ["crap", "damn", "hell", "fuck", "shit", "bastard", "asshole", "sucks", "hate", "die"]
    text_lower = text.lower()
    for word in toxic_words:
        if word in text_lower:
            return True
    return False

# ============================================================================
# PAGE: LOGIN
# ============================================================================

if not st.session_state.logged_in:
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
            
            if st.button("Enter Castle", use_container_width=True, key="login_btn"):
                if username and password:
                    st.session_state.logged_in = True
                    st.session_state.username = username
                    st.session_state.house = "gryffindor"
                    st.success(f"Welcome back, {username}!")
                    st.rerun()
                else:
                    st.error("Please enter username and password")
        
        # REGISTER TAB
        with tab2:
            st.subheader("Join the Library")
            new_username = st.text_input("Choose Username", key="reg_username")
            new_password = st.text_input("Password", type="password", key="reg_password")
            
            st.markdown("**Select Your House:**")
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                if st.button("🦁 Gryffindor", use_container_width=True, key="gryf_btn"):
                    st.session_state.selected_house_register = "gryffindor"
            with col2:
                if st.button("🟢 Slytherin", use_container_width=True, key="slyth_btn"):
                    st.session_state.selected_house_register = "slytherin"
            with col3:
                if st.button("🦡 Hufflepuff", use_container_width=True, key="huff_btn"):
                    st.session_state.selected_house_register = "hufflepuff"
            with col4:
                if st.button("🦅 Ravenclaw", use_container_width=True, key="rave_btn"):
                    st.session_state.selected_house_register = "ravenclaw"
            
            # Show selected house
            if st.session_state.selected_house_register:
                st.info(f"✅ House Selected: **{st.session_state.selected_house_register.upper()}**")
            else:
                st.warning("Please select a house")
            
            if st.button("Create Account", use_container_width=True, key="register_btn"):
                if new_username and new_password and st.session_state.selected_house_register:
                    st.session_state.logged_in = True
                    st.session_state.username = new_username
                    st.session_state.house = st.session_state.selected_house_register
                    st.success(f"Welcome to {st.session_state.selected_house_register.upper()}, {new_username}!")
                    st.rerun()
                else:
                    st.error("Please fill all fields and select a house")

# ============================================================================
# PAGE: DASHBOARD (LOGGED IN)
# ============================================================================

else:
    # Header
    col1, col2, col3 = st.columns([2, 2, 1])
    
    with col1:
        st.markdown(f'<div class="title-main">📚 The Hollow Library</div>', unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"**Welcome, {st.session_state.username}!**")
        house_class = st.session_state.house.lower()
        st.markdown(f'<span class="house-badge {house_class}">{st.session_state.house.upper()}</span>', unsafe_allow_html=True)
        
        if st.button("Logout", key="logout_btn"):
            st.session_state.logged_in = False
            st.session_state.username = None
            st.session_state.house = None
            st.rerun()
    
    st.markdown("---")
    
    # Message Board
    st.subheader("📬 Message Board")
    
    # House selection
    houses = ["General", "Gryffindor", "Slytherin", "Hufflepuff", "Ravenclaw"]
    selected_house = st.selectbox("Select Channel", houses)
    
    col1, col2 = st.columns([3, 1])
    
    with col1:
        new_message = st.text_area("Share your thoughts...", placeholder="Type your message here", height=80)
    
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
                st.error("❌ Your message was flagged as TOXIC!\nThis violates community guidelines.")
            else:
                # Add message to list
                now = datetime.now().strftime("%H:%M")
                st.session_state.messages.append({
                    "user": st.session_state.username,
                    "house": st.session_state.house,
                    "text": new_message,
                    "time": now
                })
                st.success("✅ Message posted!")
                st.rerun()
    
    # Display Messages
    st.markdown("---")
    st.subheader(f"Messages in {selected_house}")
    
    if not st.session_state.messages:
        st.info("No messages yet. Be the first to speak!")
    else:
        for msg in st.session_state.messages[::-1]:
            flagged = msg.get("flagged", False)
            msg_class = "toxic-message" if flagged else "safe-message"
            
            col1, col2 = st.columns([1, 5])
            
            with col1:
                st.write(f"**{msg['user']}**")
                st.caption(f"{msg['house'].upper()}")
            
            with col2:
                if flagged:
                    st.markdown(f'<div class="toxic-message">⚠️ {msg["text"]} [BLOCKED]</div>', unsafe_allow_html=True)
                else:
                    st.markdown(f'<div class="safe-message">{msg["text"]}</div>', unsafe_allow_html=True)
                st.caption(f"Posted at {msg['time']}")
            
            st.markdown("---")

# Footer
st.markdown("---")
st.caption("🎓 The Hollow Library - Demo Version | Powered by Streamlit")
