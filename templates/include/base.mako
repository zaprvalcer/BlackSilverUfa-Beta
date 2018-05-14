<%! from templates.utils import md5file %>
<!DOCTYPE html>
<html lang="ru-RU">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#157878">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.12/css/all.css" integrity="sha384-G0fIWCsCzJIMAVNQPfjH08cyYaUtMwjJwqiRKxxE/rx96Uroj1BtIQ6MLJuheaO9" crossorigin="anonymous">
    <link rel="stylesheet" href="/static/css/cayman.css">
    <link rel="stylesheet" href="/static/css/styles.css?hash=${md5file('static/css/styles.css')}">
    <%block name="head" />
    <!-- Matomo -->
    <script type="text/javascript">
      var _paq = _paq || [];
      /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
      _paq.push(['enableHeartBeatTimer']);
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      (function() {
        var u="//matomo.thedrhax.pw/";
        _paq.push(['setTrackerUrl', u+'piwik.php']);
        _paq.push(['setSiteId', '1']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
      })();
    </script>
    <!-- End Matomo Code -->
  </head>
  <body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <div class="mx-auto">
            <a class="navbar-brand mx-auto" href="/">${config['title']}</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link" href="https://github.com/${config['github']['user']}/${config['github']['repo']}/"><i class="fab fa-github"></i> GitHub</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container main-content">
      <%block name="content" />
    </div>

    <footer class="page-footer font-small bg-dark text-white pt-4 mt-4">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h5 class="text-uppercase">Полезные ссылки</h5>
            <ul class="list-unstyled">
              <li>
                <a href="https://bsarchive.thedrhax.pw">
                  Зеркало bsarchive.com
                </a>
              </li>
              <li>
                <a href="https://matomo.thedrhax.pw/index.php?module=CoreAdminHome&action=optOut&language=ru">
                  Отказ от участия в статистике сайта
                </a>
              </li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5 class="text-uppercase">Каналы Артура</h5>
            <ul class="list-unstyled">
              <li>
                <a href="https://www.youtube.com/user/BlackSilverUFA">
                  <i class="fab fa-youtube"></i> BlackSilverUFA
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/user/BlackSilverChannel">
                  <i class="fab fa-youtube"></i> BlackSilverChannel
                </a>
              </li>
              <li>
                <a href="https://www.twitch.tv/blackufa_twitch/">
                  <i class="fab fa-twitch"></i> BlackUFA_Twitch
                </a>
              </li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5 class="text-uppercase">Социальные сети</h5>
            <ul class="list-unstyled">
              <li>
                <li>
                  <a href="https://vk.com/b_silver">
                    <i class="fab fa-vk"></i> Группа ВКонтакте
                  </a>
                </li>
                <li>
                  <a href="https://vk.com/blacksilverufa">
                    <i class="fab fa-vk"></i> Страница ВКонтакте
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/_BlackUfa">
                    <i class="fab fa-twitter"></i> Twitter
                  </a>
                </li>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-copyright py-3 text-center small">
        <i class="far fa-copyright"></i> 2017-2018, Дмитрий Карих. Весь контент принадлежит Артуру Блэку. Разрешение на его обработку предоставлено в <a href="https://www.youtube.com/watch?v=Bxj09aAOFaI&lc=UgwQmdNhl4TMNn9-Gg94AaABAg.8ZY93MRq32E8ZY9W3KGSJS">комментарии</a> (<a href="/static/images/answer.jpg">скриншот</a>).
      </div>
    </footer>

    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js" integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js" integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm" crossorigin="anonymous"></script>
  </body>
</html>
