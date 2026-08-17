import firebase_admin
from firebase_admin import credentials, db
import pandas as pd
from sklearn.linear_model import LinearRegression
import time

# 🔥 Firebase setup
cred = credentials.Certificate("C:/Users/BHUVANESWARI/Desktop/PDL/pdlpro/serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://swms-map-24e61-default-rtdb.firebaseio.com/'
})

SLEEP_INTERVAL = 15  # seconds between updates
MIN_DATA_POINTS = 2  # minimum points needed for training

# Keep track of previous data length to avoid unnecessary retraining
prev_lengths = {}

while True:
    try:
        print("Fetching bin data...")

        # Get all bins dynamically
        bins_ref = db.reference('dustbins')  # Assuming all bins are under 'bins'
        bins_data = bins_ref.get()

        if not bins_data:
            print("No bin data found.")
            time.sleep(SLEEP_INTERVAL)
            continue

        for bin_id, bin_info in bins_data.items():
            # History of each bin
            history = bin_info.get('history')
            if not history:
                print(f"No history for {bin_id}")
                continue

            df = pd.DataFrame(history).T.dropna()
            if len(df) < MIN_DATA_POINTS:
                print(f"Not enough data for {bin_id}")
                continue

            # Skip if no new data
            if prev_lengths.get(bin_id) == len(df):
                continue
            prev_lengths[bin_id] = len(df)

            # Convert timestamps to elapsed seconds
            timestamps = df['timestamp'].values
            X = (timestamps - timestamps[0]).reshape(-1, 1)
            y = df['fillLevel'].values

            # Train Linear Regression
            model = LinearRegression()
            model.fit(X, y)

            # Predict future fill level (+1 hour)
            future_time = X[-1][0] + 3600
            future_pred = model.predict([[future_time]])[0]
            future_pred = max(0, min(100, future_pred))

            # Predict time to full
            slope = model.coef_[0]
            intercept = model.intercept_

            if slope <= 0 or future_pred >= 100:
                minutes_to_full = 0  # Not filling or already full
            else:
                time_full = (100 - intercept) / slope
                minutes_to_full = max(0, (time_full - X[-1][0]) / 60)  # convert to minutes
                # Optional clamp to 1 week
                minutes_to_full = min(minutes_to_full, 10080)

            # 🔥 Upload prediction to Firebase
            prediction_ref = db.reference(f'dustbins/{bin_id}/prediction')
            prediction_ref.set({
                "futureFill": float(future_pred),
                "timeToFull_minutes": float(minutes_to_full),
                "timestamp": int(time.time())
            })

            print(f"{bin_id} ✅ Future Fill: {future_pred:.2f}%, Time to Full: {minutes_to_full:.1f} min")

    except Exception as e:
        print("Error:", e)

    time.sleep(SLEEP_INTERVAL)