package com.example.lu2pahtydbp;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.text.HtmlCompat;


import android.app.ProgressDialog;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.lu2pahtydbp.databinding.ActivityMainBinding;

import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.select.Elements;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.w3c.dom.Text;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;

public class MainActivity extends AppCompatActivity {
    private TextView mTextViewResult;
    private RequestQueue mQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mTextViewResult = findViewById(R.id.text_view_result);
        Button buttonParse1 = findViewById(R.id.button_parse);
        Button buttonParse2 = findViewById(R.id.button_parse2);
        Button buttonParse3 = findViewById(R.id.button_parse3);
        Button buttonParse4 = findViewById(R.id.button_parse4);

        mQueue = Volley.newRequestQueue(this);

        buttonParse1.setOnClickListener(view -> jsonParse());
        buttonParse2.setOnClickListener(view -> jsonParse2());
        buttonParse3.setOnClickListener(view -> jsonParse3());
        buttonParse4.setOnClickListener(view -> jsonParse4());
    }

    private void jsonParse() {
        String url = "http://10.100.251.53:5000/minesweeper_mobile";

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null, response -> {
            try {
                JSONArray jsonArray = response.getJSONArray("leaderboard");

                mTextViewResult.setText("MINESWEEPER RANKING\n\n");
                mTextViewResult.setText("POSICION || ID || Usuario|| Tiempo\n\n");
                for (int i = 0; i < 10; i ++){
                    JSONObject players = jsonArray.getJSONObject(i);

                    int id = players.getInt("id");
                    String player_username = players.getString("player_username");
                    int time = players.getInt("time");
                    mTextViewResult.append((i+1) + " || " + id + " || " + player_username + " || " + time + "\n\n");
                }
            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
        }, error -> {
            error.printStackTrace();
            mTextViewResult.setText("Error");
        });

        mQueue.add(request);
    }

    private void jsonParse2() {
        String url = "http://10.100.251.53:5000/TicTacToe_mobile";

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null, response -> {
            try {
                JSONArray jsonArray = response.getJSONArray("winners");

                mTextViewResult.setText("TIC TAC TOE HISTORIAL\n\n");
                mTextViewResult.setText("# partida || Usuario1 || Usuario2 || Ganador\n\n");
                for (int i = 0; i < jsonArray.length(); i ++){
                    JSONObject players = jsonArray.getJSONObject(i);

                    int id = players.getInt("id");
                    String player1_username = players.getString("player1_username");
                    String player2_username = players.getString("player2_username");
                    String winner = players.getString("winner");
                    mTextViewResult.append(id + " || " + player1_username + " || " + player2_username + " || " + winner + "\n\n");
                }
            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
        }, error -> {
            error.printStackTrace();
            mTextViewResult.setText("Error2");
        });

        mQueue.add(request);
    }

    private void jsonParse3() {
        String url = "http://10.100.251.53:5000/Connect4_mobile";

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null, response -> {
            try {
                JSONArray jsonArray = response.getJSONArray("winners");

                mTextViewResult.setText("CONNECT 4 HISTORIAL\n\n");
                mTextViewResult.setText("# partida || Usuario1 || Usuario2 || Ganador\n\n");
                for (int i = 0; i < jsonArray.length(); i ++){
                    JSONObject players = jsonArray.getJSONObject(i);

                    int id = players.getInt("id");
                    String player1_username = players.getString("player1_username");
                    String player2_username = players.getString("player2_username");
                    String winner = players.getString("winner");
                    mTextViewResult.append(id + " || " + player1_username + " || " + player2_username + " || " + winner + "\n\n");
                }
            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
        }, error -> {
            error.printStackTrace();
            mTextViewResult.setText("Error3");
        });

        mQueue.add(request);
    }

    private void jsonParse4() {
        String url = "http://10.100.251.53:5000/players_mobile";

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null, response -> {
            try {
                JSONArray jsonArray = response.getJSONArray("players");

                mTextViewResult.setText("JUGADORES REGISTRADOS\n\n");
                mTextViewResult.setText("Email          ||          Usuario \n\n");
                for (int i = 0; i < jsonArray.length(); i ++){
                    JSONObject players = jsonArray.getJSONObject(i);

                    String email = players.getString("email");
                    String username = players.getString("username");
                    mTextViewResult.append(email + " || " + username + "\n\n");
                }
            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
        }, error -> {
            error.printStackTrace();
            mTextViewResult.setText("Error4");
        });

        mQueue.add(request);
    }
}
